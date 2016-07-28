// /**
//  * We assume that special characters may be escaped by /
//  */
//
// // For example:
// //     "Kurt G{\"o}del"
//
// var readable = fs.createReadStream("walmart.dump", {
//   encoding: 'utf8',
//   fd: null
// });
//
// readable.on('readable', () -> {
//   let chunk;
//   while (null !== (chunk = readable.read(1))) {
//     console.log(chunk); // chunk is one symbol
//   }
// });
