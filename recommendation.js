export function getTopKRecommendations(user_votes, band_feats, k) {
  const user_feats = tf.matMul(user_votes, band_feats);
  const { indices, values } = user_feats.topk(k);
  const arr = values.arraySync();

  return tf.tidy(() =>
    indices.arraySync().map((indices, userIndex) => {
      return {
        user: users[userIndex],
        recommendations: indices.map((index) => {
          return {
            feature: features[index],
            value: arr[userIndex][index],
          };
        }),
      };
    })
  );
}
