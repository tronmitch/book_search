const { User } = require("../models")

const resolvers = {
     Query: {
          me: async (_, { userId, username }) => {
            const foundUser = await User.findOne({
              $or: [{ _id: userId }, { username: username }],
            });
            return foundUser;
          },

          searchBookQuery: async (_, { query }) => {
               try {
               console.log("Resolver: ", query)
                 const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
                 
                 if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
                 }
                 const data = await response.json();
                 console.log("Response: ", data)
                 return data.items.map(book => ({
                   bookId: book.id,
                   title: book.volumeInfo.title,
                   authors: book.volumeInfo.authors || ['No author to display'],
                   description: book.volumeInfo.description,
                   image: book.volumeInfo.imageLinks?.thumbnail || '',
                   link: book.volumeInfo.previewLink,
                 }));
               } catch (error) {
                 console.error('Error fetching books from Google Books API:', error);
                 throw new Error('Failed to fetch books from Google Books API');
               }
             }
        },
        Mutation: {
          addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
          //   const token = signToken(user);
          //   return { token, user };
            return { user };
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