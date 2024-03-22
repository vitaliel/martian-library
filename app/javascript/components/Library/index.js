import React, { useState } from "react";
import { Query } from "react-apollo";

import { LibraryQuery } from './operations.graphql';
import UpdateItemForm from "../UpdateItemForm";
import { SubscriptionAdded, SubscriptionUpdated } from '../Subscription';

import cs from './styles';

const Library = () => {
  const [item, setItem] = useState(null);

  return (
    <Query query={LibraryQuery}>
      {({ data, loading, subscribeToMore }) => (
        <div className={cs.library}>
          {loading || !data.items
            ? 'loading...'
            : data.items.map(({ title, id, user, imageUrl, description }) => (
              <button
                key={id}
                className={cs.plate}
                onClick={() => setItem({ title, id, imageUrl, description })}
              >
                <div className={cs.title}>{title}</div>
                <div>{description}</div>
                {imageUrl && <img src={imageUrl} className={cs.image}/>}
                {user ? (
                  <div className={cs.user}>added by {user.email}</div>
                ) : null}
              </button>
            ))}

          {item != null && (
            <UpdateItemForm
              id={item.id}
              initialTitle={item.title}
              initialDescription={item.description}
              initialImageUrl={item.imageUrl}
              // TODO errors
              onClose={() => setItem(null)}
            />
          )}
          <SubscriptionAdded subscriptionToMore={subscribeToMore}/>
          <SubscriptionUpdated subscriptionToMore={subscribeToMore}/>
        </div>
      )}
    </Query>
  );
};

export default Library;
