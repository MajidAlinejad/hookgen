import {configStore} from '../../config/index.ts';
import {saveBatch} from '../../func/Save/save.ts';
import {getFromSwaggerRootHtml, getSwaggerSchemaJsons} from '../../ssl/get.ts';
import {} from '../../config/index.ts';
import {URL} from '../../types.ts';

export async function getDefinationsAndSave() {
  function regFilter(item: URL): URL | null {
    if (!configStore?.filter) {
      return item;
    }
    return configStore?.filter?.test(item.name) ? null : item;
  }

  const Swaggerlist = await getFromSwaggerRootHtml({
    baseUrl: configStore?.baseUrl + '/swagger/index.html',
  });

  const promisses = Swaggerlist.urls
    .filter(item => regFilter(item))
    .map(item => {
      return configStore?.baseUrl + item.url;
    });

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
