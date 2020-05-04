class Api::V1::SessionsController < ApplicationController
  include CurrentUserConcern

  def create
    user = User.find_by( email: parameters["id"])
    if user.nil?
      user = User.find_by( username: parameters["id"])
    end
    user = user.try( :authenticate, parameters["password"])
    if user
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
      render json: { status: :unauthorized, code: 401 }, status: :unauthorized
    end
  end
 
  def destroy
    render json: {
      status: :ok,
      code: 200,
      authToken: nil
    }
  end

  private 
  def parameters
    JSON.parse( request.body.read())["user"]
  end
end
