import React from 'react';
import { Mutation } from "react-apollo";
import { UpdateItemMutation } from './operations.graphql';
import ProcessItemForm from "../ProcessItemForm";

import cs from "./styles";

const UpdateItemForm = ({
                          id,
                          initialTitle,
                          initialDescription,
                          initialImageUrl,
                          onClose
                        }) => (
  <div className={cs.overlay}>
    <div className={cs.content}>
      <Mutation mutation={UpdateItemMutation}>
        {(updateItem, { loading, data }) => (
          <ProcessItemForm
            initialTitle={initialTitle}
            initialDescription={initialDescription}
            initialImageUrl={initialImageUrl}
            buttonText='Update Item'
            loading={loading}
            errors={data && data.updateItem.errors}
            onProcessItem={({ title, description, imageUrl }) => {
              updateItem({
                variables: {
                  id,
                  title,
                  description,
                  imageUrl
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  updateItem: {
                    __typename: 'UpdateItemMutationPayload',
                    item: {
                      id,
                      __typename: 'Item',
                      title,
                      description,
                      imageUrl
                    }
                  }
                }
              });
              onClose();
            }}
          />
        )}
      </Mutation>
      <button className={cs.close} onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export default UpdateItemForm;
