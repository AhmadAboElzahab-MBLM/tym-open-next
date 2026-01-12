export const getProductBuildYourOwnLink = (lang, model, modelId, configure = false) => `/${lang}/products/tractors/build-your-own?model=${model}${modelId ? `&modelId=${modelId}` : ''}${configure ? '&configure=true' : ''}`;

export const getProductLink = (item) => item.route.path;
