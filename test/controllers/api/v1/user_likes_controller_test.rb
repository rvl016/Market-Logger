require 'test_helper'

class Api::V1::UserLikesControllerTest < ActionDispatch::IntegrationTest
  test "should get post" do
    get api_v1_user_likes_post_url
    assert_response :success
  end

end
