/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: {{{year}}}*/
/**
 * Resolve Index
 * @copyright {{{year}}} Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { GraphQLUpload } = require("graphql-upload");

const updateUserResolver = require("./update/updateUser");
const singleUserResolver = require("./single/singleUser");
const typeUserResolver = require("./type/typeUser");

const createLinkResolver = require("./create/createLink");
const typeLinkResolver = require("./type/typeLink");
const singleLinkResolver = require("./single/singleLink");
const deactivateAllLinksResolver = require("./delete/deactivateAllLinks");
const singleMovieResolver = require("./single/singleMovie");
const allMoviesResolver = require("./all/allMovies");
const singleActorResolver = require("./single/singleActor");
const singleDirectorResolver = require("./single/singleDirector");
const singleGenreResolver = require("./single/singleGenre");
const singleReviewResolver = require("./single/singleReview");
const allActorsResolver = require("./all/allActors");
const allDirectorsResolver = require("./all/allDirectors");
const allGenreResolver = require("./all/allGenre");
const allReviewsResolver = require("./all/allReviews");
const createActorResolver = require("./create/createActor");
const allMovieActorResolver = require("./all/allMovieActor");

// const calendarResolver = require('./custom/calendar');
// const noteResolver = require("./custom/note");
// const customImageResolver = require("./custom/image");
// const uploadFileMutationResolver = require("./custom/uploadFile");

// const connectionStepsResolver = require("./custom/connectionSteps");

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    user: singleUserResolver,
    link: singleLinkResolver,
    // ...calendarResolver.Query,
    // ...customImageResolver.Query,
    // ...noteResolver.Query,
    // ...connectionStepsResolver.Query,
    getSingleMovie: singleMovieResolver,
    getSingleActor: singleActorResolver,
    getSingleDirector: singleDirectorResolver,
    getSingleGenre: singleGenreResolver,
    getSingleReview: singleReviewResolver,

    getAllMovies: allMoviesResolver,
    getAllActors: allActorsResolver,
    getAllDirectors: allDirectorsResolver,
    getAllGenre: allGenreResolver,
    getAllReviews: allReviewsResolver,
    getAllMovieActors: allMovieActorResolver,
  },
  Mutation: {
    updateUser: updateUserResolver,
    createLink: createLinkResolver,
    deactivateAllLinks: deactivateAllLinksResolver,
    // uploadFile: uploadFileMutationResolver,
    // ...calendarResolver.Mutation,
    // ...customImageResolver.Mutation,
    // ...noteResolver.Mutation,
    addActorToMoviesForGenre: createActorResolver,
  },

  // ...calendarResolver.Type,
  // ...noteResolver.Type,

  User: typeUserResolver,
  Link: typeLinkResolver,
};
