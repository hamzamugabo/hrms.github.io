module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL),
                    VITE_APP_API_URL_AUTH: JSON.stringify(process.env.VITE_APP_API_URL_AUTH),
                    VUE_APP_API_KEY: JSON.stringify(process.env.VUE_APP_API_KEY)
                }
            })
        ]
    }
};
