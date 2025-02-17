module Mutations
  class UpdateItemMutation < BaseMutation
    argument :id, ID, required: true
    argument :attributes, Types::ItemAttributes, required: true

    field :item, Types::ItemType, null: true
    field :errors, Types::ValidationErrorsType, null: true

    def resolve(id:, attributes:)
      check_authentication!

      item = Item.find(id)

      if item.update(attributes.to_h)
        MartianLibrarySchema.subscriptions.trigger('itemUpdated', {}, item)
        { item: item, errors: nil }
      else
        { item: nil, errors: item.errors }
      end
    end
  end
end
