const { User } = require("../models")

const resolvers = {
     Query: {
          getSingleUser: async (_, { userId, username }) => {
            const foundUser = await User.findOne({
              $or: [{ _id: userId }, { username: username }],
            });
            return foundUser;
          },
        },
        Mutation: {
          createUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
              throw new Error("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
              throw new Error('Wrong password!');
            }
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (_, { userId, book }) => {
            const updatedUser = await User.findOneAndUpdate(
              { _id: userId },
              { $addToSet: { savedBooks: book } },
              { new: true, runValidators: true }
            );
            return updatedUser;
          },
          deleteBook: async (_, { userId, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
              { _id: userId },
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            );
            return updatedUser;
          },
        }
      };

module.exports = resolvers