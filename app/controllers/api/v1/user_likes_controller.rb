class Api::V1::UserLikesController < ApplicationController

  def postLike
    authUserId = checkNRenewAuth
    return if ! authUserId 
    userLike = nameId
    begin
      puts authUserId[:user_id] 
      puts userLike
      UserLike.create( { user_id: authUserId[:user_id], 
        name_id: userLike})
      render json: { 
        status: :created,
        code: 201,
        authToken: authUserId[:authToken]
      }, status: :created
    rescue
      render json: { 
        status: :bad_request,
        code: 400,
        authToken: authUserId[:authToken],
        message: "Make sure liked id exists.",
      }, status: :bad_request
    end
  end

  def deleteLike
    authUserId = checkNRenewAuth
    return if ! authUserId 
    userLike = nameId
    begin
      UserLike.find_by( { user_id: authUserId[:user_id], 
        name_id: userLike}).destroy!
      render json: { 
        status: :ok,
        code: 200,
        authToken: authUserId[:authToken],
        message: "Deleted." }
    rescue
      render json: { 
        status: :bad_request,
        code: 400,
        authToken: authUserId[:authToken],
        message: "Make sure user like id exists.",
      }, status: :bad_request
    end
  end

  def getLikes
    authUserId = checkNRenewAuth
    return if ! authUserId
    nameIds = UserLike.getUserLikes( authUserId[:user_id])
    render json: {
      status: :ok,
      code: 200,
      authToken: authUserId[:authToken],
      userLikes: nameIds
    }, status: :ok
  end

  private 
  def nameId
    JSON.parse( request.body.read())["name_id"]
  end

  def checkNRenewAuth
    newKey = JsonWebToken.authRefresh( request.headers["Auth-Token"])
    if ! newKey
      render json: { status: :forbidden, code: 403 }, status: :forbidden
      return false
    end
    userParams = JsonWebToken.decode newKey
    return { authToken: newKey, user_id: userParams[:user_id] }
  end
end
