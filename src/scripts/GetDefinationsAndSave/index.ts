import {configStore} from '../../config/index.ts';
import {saveBatch} from '../../func/Save/save.ts';
import {getFromSwaggerRootHtml, getSwaggerSchemaJsons} from '../../ssl/get.ts';
import {} from '../../config/index.ts';
import {URL} from '../../types.ts';

export async function getDefinationsAndSave() {
  let promisses: string[] = [];
  function regFilter(item: URL): URL | null {
    if (!configStore?.filter) {
      return item;
    }
    const res = configStore?.filter?.test(item.url) ? null : item;
    return res;
  }
  if (!configStore?.singleJson) {
    const Swaggerlist = await getFromSwaggerRootHtml({
      baseUrl: configStore?.baseUrl + '/swagger/index.html',
    });

    promisses = Swaggerlist.urls
      .filter(item => regFilter(item))
      .map(item => {
        return configStore?.baseUrl + item.url;
      });
  } else {
    promisses = [configStore?.baseUrl];
  }

  const jsonsSchemas = await getSwaggerSchemaJsons({requests: promisses});

  const fileTosave = jsonsSchemas.map(data => ({
    data: JSON.stringify(data),
    name: data.info.title + '.' + data.info.version,
  }));
  configStore?.archive &&
    (await saveBatch({
      location: 'archive/',
      beautify: false,
      extention: '.json',
      files: fileTosave,
    }));

  return jsonsSchemas;
}
