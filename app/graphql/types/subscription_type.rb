module Types
  class SubscriptionType < GraphQL::Schema::Object
    field :item_added, Types::ItemType, null: true, description: 'An item was added'
    field :item_updated, Types::ItemType, null: true, description: 'Existing item was updated'

    # def item_added
    # end
    # def item_updated
    # end
  end
end
