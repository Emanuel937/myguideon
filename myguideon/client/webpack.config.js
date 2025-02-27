const path = require('path');

module.exports = {
  entry: './src/index.js',  // Fichier principal JavaScript
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Emplacement de sortie du fichier bundle
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],  // Extensions de fichiers à résoudre (incluant .js)
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Capture les fichiers .ts et .tsx pour le traitement TypeScript
        use: 'ts-loader',  // Utilisation de ts-loader pour compiler le TypeScript
        exclude: /node_modules/,  // Ne pas traiter les fichiers dans node_modules
      },
      {
        test: /\.css$/,  // Capture tous les fichiers CSS
        use: [
          'style-loader',  // Injecte les styles dans le DOM
          'css-loader',    // Résout les imports CSS
          'postcss-loader', // Traite les fichiers avec PostCSS (ex. autoprefixer, tailwindcss)
        ],
      },
    ],
  },
  devtool: 'source-map',  // Pour des cartes de source (source maps) utiles pour le débogage
  mode: 'development',  // Mode de développement
};
