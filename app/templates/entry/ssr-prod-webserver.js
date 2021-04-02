/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join } from 'path'
import express from 'express'
import { renderToString } from '@vue/server-renderer'
import createRenderer from '@quasar/ssr-helpers/create-renderer'

import renderTemplate from './render-template.js'
import serverManifest from './quasar.server-manifest.json'
import clientManifest from './quasar.client-manifest.json'
import injectMiddlewares from './ssr-middlewares.js'

const app = express()
const resolve = file => join(__dirname, file)

const doubleSlashRE = /\/\//g
const publicPath = `<%= build.publicPath %>`
const resolveUrlPath = publicPath === '/'
  ? url => url || '/'
  : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

// create the renderer
const renderer = createRenderer({
  vueRenderToString: renderToString,
  basedir: __dirname,
  serverManifest,
  clientManifest,
  publicPath
})

// util to serve files
const defaultCache = 1000 * 60 * 60 * 24 * 30
const serve = (path, cache = defaultCache) => express.static(resolve('www/' + path), {
  maxAge: cache
})

// serve this with no cache, if built with PWA:
<% if (ssr.pwa) { %>
app.use(resolveUrlPath('/service-worker.js'), serve('service-worker.js', 0))
<% } %>

// serve "www" folder
app.use(resolveUrlPath('/'), serve('.'))

// inject custom middleware
injectMiddlewares({
  app,
  resolveUrlPath,
  render: {
    vue: ssrContext => renderer(ssrContext, renderTemplate)
  }
})

// finally start listening to clients
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server listening at port ' + port)
})
