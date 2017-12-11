const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('winston');
const NotFoundError = require('./NotFoundError');
const { exec } = require('child-process-promise');
const r = require('rethinkdb');

const server = express();
server.use(cors());
server.use(bodyParser.json());

const parseUrl = (url) => {
  let crawler = '';
  if (url.indexOf('freeride-surfwear') !== -1) {
    crawler = 'freeride';
  } else if (url.indexOf('snowbeach') !== -1) {
    crawler = 'snowbeach';
  } else if (url.indexOf('hawaiisurf') !== -1) {
    crawler = 'hawaiisurf'
  }

  if (crawler.length === 0) {
    throw new NotFoundError('Unable to crawl this site.', 3);
  } else {
    return exec(
      'scrapy crawl ' + crawler + ' -s LOG_ENABLED=False -s FEED_FORMAT=json -s FEED_URI=stdout: -a start_url=' + url,
      { cwd: './scrapers' }
    ).then((res) => {
      try {
        return JSON.parse(res.stdout)[0];
      } catch (e) {
        throw new NotFoundError("Error while fetching datas", 2);
      }
    }).catch((err) => {
      throw new NotFoundError(err, 2);
    });
  }
};

const router = express.Router()
  .options('*', cors())
  .post('/list/create', function (req, res, next) {
    r.connect({ db: 'compare' }, function (err, conn) {
      if (err) {
        next(new NotFoundError('Database connection error', 4));
      } else {
        r.table('list').insert({ uris: [] }).run(conn, function(err, result) {
          if (err) {
            next(new NotFoundError('Database connection error', 4));
          } else {
            res.json({ id: result.generated_keys[0] });
          }

          conn.close();
        });
      }
    });
  })
  .get('/list/:id', function (req, res, next) {
    r.connect({ db: 'compare' }, function (err, conn) {
      if (err) {
        next(new NotFoundError('Database connection error', 4));
      } else {
        r.table('list').getAll(req.params.id, {index: 'id'})
          .concatMap(l => l('uris'))
          .eqJoin(i => i, r.table('link')).zip()
          .run(conn, function(err, result) {
            if (err) {
              next(new NotFoundError('Database connection error', 4));
            } else {
              result.toArray((err, results) => { res.json(results); });
            }
          });
      }
    });
  })
  .post('/list/:id/add', function (req, res, next) {
    if (req.body.url) {
      r.connect({ db: 'compare' }, function (err, conn) {
        if (err) {
          next(new NotFoundError('Database connection error', 4));
        } else {
          r.table('link').getAll(req.body.url, { index: 'url' }).run(conn, function(err, result) {
            if (err) {
              next(new NotFoundError('Database connection error', 4));
            } else {
              result.toArray((err, results) => {
                if (results.length > 0) {
                  r.table('list').get(req.params.id).update({
                    uris: r.row('uris').append(results[0].id)
                  }).run(conn, function(err) {
                    if (err) {
                      next(new NotFoundError('Database connection error', 4));
                    } else {
                      res.json(results[0]);
                    }
                  });
                } else {
                  try {
                    parseUrl(req.body.url)
                      .then ((linkObj) => {
                        linkObj.url = req.body.url;

                        r.table('link').insert(linkObj, { returnChanges: true }).run(conn, function(err, result) {
                          if (err) {
                            next(new NotFoundError('Database connection error', 4));
                          } else {
                            r.table('list').get(req.params.id).update({
                              uris: r.row('uris').append(result.generated_keys[0])
                            }).run(conn, function(err) {
                              if (err) {
                                next(new NotFoundError('Database connection error', 4));
                              } else {
                                res.json(linkObj);
                              }
                            });
                          }

                          conn.close();
                        }).catch((e) => { next(e); });
                      })
                  } catch (e) {
                    next(e);
                  }
                }
              });
            }
          });
        }
      });
    } else {
      next(new NotFoundError('Missing url parameter', 1));
    }
  })
  .post('/link/crawl', function (req, res, next) {
    if (req.body.url) {
      try {
        parseUrl(req.body.url)
          .then((json) => { res.json(json); })
          .catch((e) => { next(e); });
      } catch (e) {
        next(e);
      }
    } else {
      next(new NotFoundError('Missing url parameter', 1));
    }
  })
  .use(function (err, req, res) {
    logger.error(err);

    if (req.app.get('env') === 'production') {
      delete err.stack;
    }

    res.status(err.statusCode || 500).json({ error: err });
  });

server.use('/api', router);
server.listen(8081);
