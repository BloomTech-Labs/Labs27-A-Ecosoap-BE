const { gql, request } = require('graphql-request');
const { url } = require('../../config/gql');

const findAllBuyers = async () => {
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

const findAllAdmins = async () => {
  const { administrators } = await request(
    url,
    gql`
      {
        administrators {
          id
          email
        }
      }
    `
  );
  return administrators.map((admin) => ({ ...admin, type: 'admin' }));
};

const findAll = async () => {
  return [...(await findAllAdmins()), ...(await findAllBuyers())];
};

const findAdminByEmail = async (email) => {
  const profiles = await findAllAdmins();
  return profiles.find((profile) => profile.email === email);
};

const findBuyerByEmail = async (email) => {
  const profiles = await findAllBuyers();
  return profiles.find((profile) => profile.email === email);
};

const findByEmail = async (email) => {
  const profiles = await findAll();
  return profiles.find((profile) => profile.email === email);
};

const findBuyerById = async (id) => {
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
  return buyerById ? { ...buyerById, type: 'buyer' } : undefined;
};

const createBuyer = async (profile) => {
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
    return findBuyerByEmail(profile.email);
  } else {
    throw new Error(error);
  }
};

const updateBuyer = async (id, profile) => {
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

  return updateBuyerProfile.buyer
    ? { ...updateBuyerProfile.buyer, type: 'buyer' }
    : undefined;
};

const removeBuyer = async (email) => {
  const buyer = await findBuyerByEmail(email);

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

module.exports = {
  findAllBuyers,
  findBuyerById,
  findBuyerByEmail,
  createBuyer,
  updateBuyer,
  removeBuyer,
  findAllAdmins,
  findAdminByEmail,
  findAll,
  findByEmail,
};
