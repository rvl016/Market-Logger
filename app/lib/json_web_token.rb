class JsonWebToken
  SECRET_KEY = Rails.application.secrets.secret_key_base.to_s

  def self.encode( payload, exp = 10.minutes.from_now)
    payload[:exp] = exp.to_i
    JWT.encode payload, SECRET_KEY
  end

  def self.decode( token)
    begin
      decoded = JWT.decode( token, SECRET_KEY)
    rescue JWT::ExpiredSignature
      return :expiredKey
    rescue JWT::DecodeError
      return :invalidKey
    end
    HashWithIndifferentAccess.new decoded[0]
  end

  def self.authRefresh( authToken)
    decoded = decode( authToken) 
    return false if [:expiredKey, :invalidKey].include? decoded
    return encode( decoded)
  end
end