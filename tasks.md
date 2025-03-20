TODO:
- Change all functions in +layout.server.js (root folder) to remove (period) param and just reply with "metric"."period", so that all data is retrieved for all periods. this means that no functions, queries or anything will have to be reloaded everytime.
- make every component in dashboard listen to period $state change and change data accordingly, see ./src/lib/components/testComp.svelte for how this is done.
- move ./src/routes/dashboard/funcs/ to save location (somewhere in lib)
- change all "../../lib" to "$lib"
- test caching and if there's a great loading speed advantage adopt it (redis?)
