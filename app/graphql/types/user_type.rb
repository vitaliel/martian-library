module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :full_name, String, null: false
    field :email, String, null: true

    def full_name
      [object.first_name, object.last_name].compact.join(" ")
    end
  end
end
