require 'test_helper'

class Api::V1::ProfilesControllerTest < ActionDispatch::IntegrationTest
  test "should get post" do
    get api_v1_profiles_post_url
    assert_response :success
  end

end
