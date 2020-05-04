require 'test_helper'

class Api::V1::SignUpControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_sign_up_index_url
    assert_response :success
  end

end
