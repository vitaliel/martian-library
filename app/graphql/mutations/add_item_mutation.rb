module Mutations
  # https://github.com/rmosolgo/graphql-ruby/blob/master/guides/mutations/mutation_errors.md
  class AddItemMutation < Mutations::BaseMutation
    argument :attributes, Types::ItemAttributes, required: true

    field :item, Types::ItemType, null: true
    field :errors, Types::ValidationErrorsType, null: true

    def resolve(attributes:)
      check_authentication!

      item = Item.new(
        attributes.to_h.merge(
          user: context[:current_user]
        )
      )

      if item.save
        MartianLibrarySchema.subscriptions.trigger('itemAdded', {}, item)
        { item: item, errors: nil }
      else
        { item: nil, errors: item.errors }
      end
    end
  end
end
