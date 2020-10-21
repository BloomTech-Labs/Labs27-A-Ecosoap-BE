// @ts-check

const { gql, request } = require('graphql-request');
const { url } = require('../../config/gql');

/**
 * @typedef OrderInfo
 * @property {string} contactName
 * @property {string} contactEmailAddress
 * @property {number} barsRequested
 * @property {string} country
 * @property {string} [organizationName]
 * @property {number} [beneficiaries]
 */

/**
 * @typedef PricingInfo
 * @property {boolean} hasPrice
 * @property {number} price
 */

/**
 * Check for valid price
 * @param {OrderInfo} orderInfo
 * @returns {Promise<PricingInfo>}
 */
exports.checkPrice = async ({
  contactName,
  contactEmailAddress,
  barsRequested,
  country,
  organizationName,
  beneficiaries,
}) => {
  const data = await request(
    url,
    gql`
      query CheckPrice(
        $organizationName: String!
        $contactName: String!
        $barsRequested: Int!
        $contactEmailAddress: String!
        $country: String!
        $beneficiaries: Int!
      ) {
        checkIfPrice(
          input: {
            organizationName: $organizationName
            contactName: $contactName
            barsRequested: $barsRequested
            contactEmailAddress: $contactEmailAddress
            country: $country
            beneficiaries: $beneficiaries
          }
        ) {
          hasPrice
          price
        }
      }
    `,
    {
      contactName,
      contactEmailAddress,
      barsRequested,
      country,
      organizationName: organizationName || '',
      beneficiaries: beneficiaries || 0,
    }
  );

  return data.checkIfPrice;
};
