const { gql, request } = require('graphql-request');
const { url } = require('../../config/gql');

const findAll = async () => {
  const { buyers } = await request(
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
  return buyers.map((buyer) => ({ ...buyer, type: 'buyer' }));
};

const findByEmail = async (email) => {
  const profiles = await findAll();
  return profiles.find((profile) => profile.email === email);
};

const findById = async (id) => {
  const { buyerById } = await request(
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
  return { ...buyerById, type: 'buyer' };
};

const create = async (profile) => {
  const { success, error } = await request(
    url,
    gql`
      mutation CreateBuyer($profile: RegisterBuyerInput!) {
        registerBuyer(input: $profile) {
          success
          error
        }
      }
    `,
    { profile }
  );

  if (success) {
    return findByEmail(profile.email);
  } else {
    throw new Error(error);
  }
};

const update = async (id, profile) => {
  const { updateBuyerProfile } = await request(
    url,
    gql`
      mutation UpdateBuyer($profile: UpdateBuyerProfileInput!) {
        updateBuyerProfile(input: $profile) {
          buyer {
            id
            email
            password
            organizationName
            organizationWebsite
            contactName
            contactPhone
            address
            country
          }
        }
      }
    `,
    { profile: { ...profile, userId: id } }
  );

  return { ...updateBuyerProfile.buyer, type: 'buyer' };
};

const remove = async (email) => {
  const buyer = await findByEmail(email);

  const { success, error } = await request(
    url,
    gql`
      mutation RemoveBuyer($email: String!) {
        deleteBuyer(input: { email: $email }) {
          success
          error
        }
      }
    `,
    { email }
  );

  if (success) {
    return { ...buyer, type: 'buyer' };
  } else {
    throw new Error(error);
  }
};

module.exports = { findAll, findById, findByEmail, create, update, remove };
