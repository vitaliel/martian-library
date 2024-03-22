import React, { useEffect } from 'react';
import { ItemAddedSubscription, ItemUpdatedSubscription } from './operations.graphql';

// import cs from './styles';

export const SubscriptionAdded = ({ subscriptionToMore }) => {
  useEffect(() => {
    return subscriptionToMore({
      document: ItemAddedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { itemAdded } = subscriptionData.data;

        if (itemAdded) {
          const alreadyInList = prev.items.find(e => e.id === itemAdded.id)
          if (alreadyInList) return prev;
          return { ...prev, items: prev.items.concat([itemAdded]) };
        }

        return prev;
      }
    })
  }, []);
  return null;
};

export const SubscriptionUpdated = ({ subscriptionToMore }) => {
  useEffect(() => {
    return subscriptionToMore({
      document: ItemUpdatedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { itemUpdated } = subscriptionData.data;

        if (itemUpdated) {
          return {
            ...prev,
            items: prev.items.map(el =>
              el.id === itemUpdated.id ? { ...el, ...itemUpdated } : el
            )
          };
        }

        return prev;
      }
    })
  }, []);
  return null;
};
