import AdapterType from "@jbrowse/core/pluggableElementTypes/AdapterType";
import Plugin from "@jbrowse/core/Plugin";
import { AdapterClass, configSchema } from "./RefGetAdapter";
import { version } from "../package.json";

export default class RefGetPlugin extends Plugin {
  name = "RefGetPlugin";
  version = version;
  install(pluginManager: any) {
    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: "RefGetAdapter",
          configSchema,
          AdapterClass,
        }),
    );
  }
}