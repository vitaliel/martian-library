module Mutations
  class UpdateItemMutation < BaseMutation
    argument :id, ID, required: true
    argument :title, String, required: true
    argument :description, String, required: false
    argument :image_url, String, required: false

    field :item, Types::ItemType, null: true
    field :errors, Types::ValidationErrorsType, null: true

    def resolve(id:, title:, description: nil, image_url: nil)
      check_authentication!

      item = Item.find(id)

      if item.update(title: title, description: description, image_url: image_url)
        { item: item }
      else
        { errors: item.errors }
      end
    end
  end
end
