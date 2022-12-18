# jbrowse-plugin-refget-api

This plugin extends a [BaseSequenceAdapter](https://github.com/GMOD/jbrowse-components/blob/4e699451e08301a874015118ab8725659b02af38/packages/core/data_adapters/BaseAdapter.ts#L301) to retrieves sequence data from the [refget](http://samtools.github.io/hts-specs/refget.html) [compliant servers](https://andrewyatz.github.io/refget-compliance/)

To use this plugin use `RefGetAdapter` as the adapter type of the assembly names

## RefGetAdapter configuration

The RefGetAdapter contains the following configuration options:

## serverLocation (optional)
  
  URL of the refget server, the default value is: https://www.ebi.ac.uk/ena/cram/sequence
  can be changed to any server compliant with the refget schema

## sequenceData (mandatory) 

  A JSON-like object with the following format: 
    ```
    sequenceData: {
    sequenceId: {size:number, name:string},
    ...
    }
    ```

## sequenceIdType (optional)

  By default is an empty string which means that the sequenceId is an md5 checksum
  
  Example query:
  `https://www.ebi.ac.uk/ena/cram/sequence/<md5checksum>?start=NNN&end=NNN`
  
  Can be changed to `insdc` if `sequenceId` is the INSDC accession or any other value supported by the refget server.
  
  If not empty the query will be modified as the following:
  
  `https://www.ebi.ac.uk/ena/cram/sequence/<sequenceIdType>:<md5checksum>?start=NNN&end=NNN`

  
## Configuration
a configuration will look like this:
```
    "assemblies": [
    {
      "name": "assemblyName",
      "sequence": {
        "type": "ReferenceSequenceTrack",
        "trackId": "refseq_track",
        "adapter": {
          "type": "RefGetAdapter",
          "serverLocation": { // optional
            "uri": "https://www.ebi.ac.uk/ena/cram/sequence" //url of the server + /secuence endpoint
          },
          "sequenceIdType": "", // optional
          "sequenceSizes": {          // mandatory 
            "md5checksum1": {name: chr1, size: 1000000},
            "md5checksum2": {name: chr2, size: 920300},
          }
        }
      }
    }
  ]
```

## To use in @jbrowse/react-linear-genome-view 

install it via npm 


## To use in jbrowse-web

Add to the "plugins" of your JBrowse Web config:

```
{
  "plugins": [
    {
      "name": "RefGet",
      "url": "https://unpkg.com/jbrowse-plugin-refget-api/dist/jbrowse-plugin-refget-api.umd.production.min.js"
    }
  ]
}
```

You can also download this file to your local server if you don't want to use a CDN