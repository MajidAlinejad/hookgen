import {interfaceMaker} from '../InterfaceMaker/index.ts';
import {typeNameMaker} from '../TypeNameMaker/index.ts';
import {peer} from '../peer/index.ts';

interface IFinalTypeMaker {
  name: string;
  pathName: string;
  hasParams: boolean;
  hasReqBody: 'REF' | 'BODY' | null;
  type: 'Request' | 'Response' | 'Error';
}
export function finalTypeMaker({
  name,
  type,
  pathName,
  hasParams,
  hasReqBody,
}: IFinalTypeMaker) {
  const post = getPostFix(type);
  let result = '';
  if (type === 'Request') {
    result += interfaceMaker(
      typeNameMaker(name),
      hasReqBody
        ? peer(
            'data',
            hasReqBody === 'BODY'
              ? typeNameMaker(pathName + post.ref)
              : typeNameMaker(pathName + post.set)
          )
        : '' + hasParams
        ? peer('params', typeNameMaker(pathName + post.nonRef))
        : ''
    );

    return result;
    // 'interface ' +
    //   typeNameMaker(name, 'Body') +
    //   ' = ' +
    //   typeNameMaker(pathName + post.ref) +
    //   (post.set ? ` & ${typeNameMaker(pathName + post.set)};` : ';') +
    //   'type ' +
    //   typeNameMaker(name, 'Params') +
    //   ' = ' +
    //   typeNameMaker(pathName + post.nonRef) +
    //   ';';
  } else {
    result +=
      'type ' +
      typeNameMaker(name, '') +
      'Type = ' +
      typeNameMaker(pathName + post.ref) +
      ' &' +
      typeNameMaker(pathName + post.nonRef) +
      (post.set ? ` & ${typeNameMaker(pathName + post.set)};` : ';');

    return result;
  }
}

const getPostFix = (type: 'Request' | 'Response' | 'Error') => {
  const postfixes = {
    Request: {
      type: 'Request',
      ref: 'ReqBodyRef',
      set: 'ReqBody',
      nonRef: 'Params',
    },
    Response: {
      type: 'Response',
      ref: 'OkResRef',
      set: undefined,
      nonRef: 'OkRes',
    },
    Error: {
      type: 'Error',
      ref: 'BadResRef',
      set: undefined,
      nonRef: 'BadRes',
    },
  };
  return postfixes[type];
};
