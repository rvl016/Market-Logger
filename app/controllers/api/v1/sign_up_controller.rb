class Api::V1::SignUpController < ApplicationController

  def create
    user = User.new( userParams)
    if user.valid?
      user.save
      token = JsonWebToken.encode( { user_id: user.id })
      render json: {
        status: :created,
        code: 201,
        authToken: token,
        user: {
          name: user.name
        } 
      }, status: :created
    else
      render json: {
        status: :not_acceptable,
        code: 406,
        errors: @user.errors.messages
      }, status: :not_acceptable
    end
  end

  private
  def userParams
    JSON.parse( request.body.read())["user"]
  end
end
