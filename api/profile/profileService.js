const { gql, request } = require('graphql-request');
const { url } = require('../../config/gql');

const findAll = async () => {
  const data = await request(
    url,
    gql`
      {
        buyers {
          id
          email
          contactName
        }
      }
    `
  );
  return data.buyers;
};
const findById = async (id) => {
    const data = await request(
    url,
    gql`
      query FindBuyer($id: ID!) {
        buyerById(input: { id: $id }) {
          id
          email
          contactName
        }
      }
    `,
    { id }
  );
  return data.buyerById;
};
// argument = input: DeleteBuyerInput
const remove = async (id) => {
    const data = await request(
        url,
        gql`
        mutation 
        

        `
    )
}

module.exports = { findAll, findById, remove };
