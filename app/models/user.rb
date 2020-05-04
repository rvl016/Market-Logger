class User < ApplicationRecord

  EMAIL_REGEX = /\A[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\z/i
  NAME_REGEX =  /\A[A-Z][a-z]+(\s[A-Za-z][a-z]{1,11})+\z/i
  
  has_secure_password validations: false

  validates :name, 
    presence: { 
      message: "Required." 
    }, 
    length: { 
      minimum: 5,
      maximum: 30, 
      too_short: "Should be at least %{count} characters.",
      too_long: "Should be at most %{count} characters."
    }, 
    format: {
      with: NAME_REGEX,
      message: "Should contain at least one surname and first name should starts with capital letter."
    } 
  validates :username, 
    presence: { 
      message: "Required." 
    },
    uniqueness: {
      message: "Username already taken."
    }, 
    length: { 
      minimum: 5,
      maximum: 20, 
      too_short: "Should be at least %{count} characters.",
      too_long: "Should be at most %{count} characters."
    }
  validates :email, 
    presence: {
      message: "Required." 
    }, 
    uniqueness: {
      message: "Email already taken."
    }, 
    format: {
      with: EMAIL_REGEX,
      message: "This is not a valid email address."
    } 
  validates :password, 
    presence: {
      message: "Required." 
    }, 
    confirmation: {
      message: "Password confirmation doesn't match.",
      unless: -> { password.blank? }
    },
    length: {
      minimum: 6,
      maximum: 20, 
      too_short: "Should be at least %{count} characters.",
      too_long: "Should be at most %{count} characters.",
      on: :create
    }
  validates :password_confirmation, 
    presence: { 
      message: "Required."
    }

  has_many :user_likes, :primary_key => :id, :foreign_key => :user_id, :dependent => :destroy 

end
