require 'test_helper'

class Api::V1::StandoutsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_standouts_index_url
    assert_response :success
  end

end
