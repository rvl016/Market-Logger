require 'test_helper'

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get post" do
    get api_v1_sessions_post_url
    assert_response :success
  end

end
