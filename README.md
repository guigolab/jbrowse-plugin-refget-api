# jbrowse-plugin-refget-api

This plugin extends a [BaseSequenceAdapter] (https://github.com/GMOD/jbrowse-components/blob/4e699451e08301a874015118ab8725659b02af38/packages/core/data_adapters/BaseAdapter.ts#L301) to retrieves sequence data (features) from the [refget] (http://samtools.github.io/hts-specs/refget.html) [compliant servers](https://andrewyatz.github.io/refget-compliance/)

To use this plugin use "RefGetAdapter" as the adapter type of the assembly names

## Configuration
  an assembly configuration will look like this:

    "assemblies": [
    {
      "name": "assemblyName",
      "aliases": [""],
      "sequence": {
        "type": "ReferenceSequenceTrack",
        "trackId": "IdOfTheTrack",
        "adapter": {
          "type": "RefGetAdapter",
          "serverLocation": {
            "uri": "https://www.ebi.ac.uk/ena/cram/sequence/" //url of the server
          },
          "sequenceIdType": "", // md5 or insdc; md5 is the default value
          "sequenceSizes": {          //object 
            "HG996508.1": 10011747,
            "HG996509.1": 9935788
          }
        }
      }
    }
  ]




## To use in jbrowse-web

Add to the "plugins" of your JBrowse Web config:

```json
{
  "plugins": [
    {
      "name": "UCSC",
      "url": "https://unpkg.com/jbrowse-plugin-ucsc/dist/jbrowse-plugin-ucsc.umd.production.min.js"
    }
  ]
}
```

You can also download this file to your local server if you don't want to use a CDN

## To use in embedded @jbrowse/react-linear-genome-view

See [DEVELOPERS.md](DEVELOPERS.md)