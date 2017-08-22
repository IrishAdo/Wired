# Wired
A NodeJS Boilerplate for building node apps quickly.


This is a concept appliction that I came up with to look at the issue o writting NodeJs Apps and having to add require statements at the top of all of the scripts.  SOmehting I personally hate as a developer will add a require for a specific type of call say a Data Model then months later the code is moved somewhere but the require statement is left at the top of the file included and adding to the footprint.

since the server will load all Classes, Models and Routes you can then use the appliction to get a model for example to use it

```javascript
(app.get('getModel')('administrator')).find({
    email:email,
    'meta.isActive':true
},function(err,user){
    if(doc){
        res.redirect("/yes");
    } else {
        res.render('admin/login', {
            session: req.session,
            url: req.url,
            domain : req.query.domain,
            errors : ["Sorry incorrect login details"]
        });
    }
});
```
