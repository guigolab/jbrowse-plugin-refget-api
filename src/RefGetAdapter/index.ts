import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { types } from 'mobx-state-tree'
import { BaseSequenceAdapter } from '@jbrowse/core/data_adapters/BaseAdapter'
import { NoAssemblyRegion } from '@jbrowse/core/util/types'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import SimpleFeature, { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'


export const configSchema = ConfigurationSchema(
  'RefGetAdapter',
  {
    /**
     * #slot
     */
    serverLocation: {
      type: 'fileLocation',
      description: 'URL of the GA4GH refget API instance',
      defaultValue: { 
        uri: 'https://www.ebi.ac.uk/ena/cram/sequence/', 
        locationType: 'UriLocation' 
      },
    },
    sequenceIdType: {
      type: 'stringEnum',
      defaultValue:'md5',
      model: types.enumeration('SequenceIdType',['md5','insdc'])
    },
    /**
     * #slot
     */
    sequenceSizes: {
      type: 'frozen',
      defaultValue: {},
      description:
        'List of sequence objects',
    }
  },
  { explicitlyTyped: true },
)

export class AdapterClass extends BaseSequenceAdapter {
    // the sequenceSizesData can be used to speed up loading since TwoBit has to do
    // many range requests at startup to perform the getRegions request
    protected sequenceSizes: Promise<Record<string,number>>
  
    protected serverLocation : Promise<Record<string, number> | undefined >
  
    private async getSeqSizes() {
        const conf = readConfObject(this.config,'sequenceSizes')
        return Object.fromEntries(
            Object.keys(conf).map(seq => {
                return [seq, conf[seq]]
            }))
     }
      // check against default and empty in case someone makes the field blank in
      // config editor, may want better way to check "optional config slots" in
      // future
      // console.log(conf)
      // if (conf.uri !== '/path/to/default.chrom.sizes' && conf.uri !== '') {
      //   const file = openLocation(conf, this.pluginManager)
      //   const data = await file.readFile('utf8')
      //   return Object.fromEntries(
      //     data
      //       ?.split(/\n|\r\n|\r/)
      //       .filter(line => !!line.trim())
      //       .map(line => {
      //         const [name, length] = line.split('\t')
      //         return [name, +length]
      //       }),
      //   )
      // }
      // return undefined
  //   }
  
    constructor(
      config: AnyConfigurationModel,
      getSubAdapter?: getSubAdapterType,
      pluginManager?: PluginManager,
    ) {
      super(config, getSubAdapter, pluginManager)
      this.sequenceSizes = this.getSeqSizes()
      this.serverLocation = readConfObject(this.config, 'serverLocation')
    }
  
    public async getRefNames() {
      // const sequenceSizesData = this.sequenceSizesData
      // if (sequenceSizesData && sequenceSizesData.length) {
      //   return sequenceSizesData.map(s => s.id)
      // }
      return []
    }
  
    public async getRegions(): Promise<NoAssemblyRegion[]> {
      const sequenceSizesData = await this.sequenceSizes
      return Object.keys(sequenceSizesData).map(refName => ({
          refName,
          start: 0,
          end: sequenceSizesData[refName],
      }))
     }
    /**
     * Fetch features for a certain region
     * @param param -
     * @returns Observable of Feature objects in the region
     */
    public getFeatures({ refName, start, end }: NoAssemblyRegion) {
      return ObservableCreate<Feature>(async observer => {
          const { uri } = readConfObject(this.config, 'serverLocation')
          const idQuery = readConfObject(this.config, 'sequenceIdType') === 'insdc' ?  `insdc:${refName}`: refName
      try {
          const result = await fetch(`${uri}/${idQuery}?start=${start}&end=${end}`)
          if (!result.ok) {
              throw new Error(
                  `Failed to fetch ${result.status} ${result.statusText}`,
              );
          }
          const seq = await result.text()
          if (seq) {
              observer.next(
                new SimpleFeature({
                  id: `${refName} ${start}-${end}`,
                  data: { refName, start, end: end, seq },
                }),
              )
            }
            observer.complete()
      }catch (e) {
          observer.error(e);
        }
      })
    }
    /**
     * called to provide a hint that data tied to a certain region
     * will not be needed for the foreseeable future and can be purged
     * from caches, etc
     */
    public freeResources(/* { region } */): void {}
  }