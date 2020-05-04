Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      get 'user_likes/post'
    end
  end
  namespace :api do
    namespace :v1 do
      get 'profiles/post'
    end
  end
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      get 'standouts/index'

      get 'summary/index'
      get 'summary/show', to: 'summary#show'

      get 'profiles/index'
      get 'profiles/:symbol', to: 'profiles#show'

      post 'query', to: 'search#post'

      post 'auth/signup', to: 'sign_up#create'
      post 'auth/login', to: 'sessions#create'
      delete 'auth/login', to: 'sessions#destroy'

      get 'user/likes', to: 'user_likes#getLikes'
      post 'user/likes', to: 'user_likes#postLike'
      delete 'user/likes', to: 'user_likes#deleteLike'
    end
  end
  
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '*path', to: 'static#index', constraints: -> (req) do 
    ! req.xhr? && req.format.html?
  end

  root 'static#index'

end
