export function toTree(data: any, rootName: string) {
  var map: any = {};
  data.forEach(function (item: any) {
    map[item.id] = item;
  });
  //   console.log(map);
  let val: any[] = [];
  data.forEach(function (item: any) {
    // 以当前遍历项，的parentId,去map对象中找到索引的id
    var parent = map[item.parentId];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push({
        id: item.id,
        parentId: item.parentId,
        label: item.typeName,
      });
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      if (item.children) {
        val.push({
          id: item.id,
          parentId: item.parentId,
          label: item.typeName,
          children: item.children,
        });
      } else {
        val.push({
          id: item.id,
          parentId: item.parentId,
          label: item.typeName,
        });
      }
    }
  });
  return [
    {
      id: -1,
      parentId: -1,
      label: rootName,
      children: val,
    },
  ];
}

/**
 * 将列表转为树形结构,该方法不会破坏原有数据,但会增加循环次数,数据顺序不会颠倒
 * @param data 需要递归的数据
 * @param rootName 根目录名称
 * @returns 递归后的数据
 */
export function toTreeIdUnchange(data: any[], rootName: string, rootId?: number) {
  let ancestors: any[] = [];
  let nextLoopData: any[] = [];
  data.forEach(element => {
    // 注意,需要指定顶层结构的superiorCode为0
    if (element.parentId === (rootId ? rootId : 0)) {
      ancestors.push({
        id: element.id,
        parentId: element.parentId,
        label: element.typeName
      });
    } else {
      nextLoopData.push(element);
    }
  });
  recursionIdUnchange(ancestors, nextLoopData);
  return [
    {
      id: 0,
      parentId: 0,
      label: rootName,
      children: ancestors,
    },
  ];
}

function recursionIdUnchange(upDatas: any[], downDatas: any[]) {
  let nextUpDatas: any[] = [];
  let nextLoopData: any[] = [];
  downDatas.forEach(element => {
    let flag: boolean = false;
    upDatas.forEach(element1 => {
      let children: any[] = [];
      if (!(Object.prototype.hasOwnProperty.call(element1, "children"))) {
        element1["children"] = children;
      } else {
        children = element1["children"];
      }
      if (element1["id"] === element["parentId"]) {
        let treeItem = {
          id: element.id,
          parentId: element.parentId,
          label: element.typeName
        };
        children.push(treeItem);
        nextUpDatas.push(treeItem);
        flag = true;
        return;
      }
    });
    if (!flag) {
      nextLoopData.push(element);
    }
  });
  if (nextLoopData.length > 0) {
    recursionIdUnchange(nextUpDatas, nextLoopData);
  }
}


/**
 * 将列表转为树形结构,该方法会破坏原有数据,且数据顺序会颠倒
 * @param data 需要递归的数据
 * @param rootName 根目录名称
 * @returns 递归后的数据
 */
export function toTreeCode(data: any[], rootName: string) {
  let ancestors: any[] = [];
  let length = data.length - 1;
  for (let index = length; index >= 0; index--) {
    const element = data[index];
    // 注意,需要指定顶层结构的superiorCode为0
    if (element.superiorCode === '0') {
      ancestors.push({
        typeCode: element.typeCode,
        superiorCode: element.superiorCode,
        label: element.typeName
      });
      data.splice(index, 1);
    }
  }
  recursionCode(ancestors, data);
  return [
    {
      typeCode: '0',
      superiorCode: '0',
      label: rootName,
      children: ancestors,
    },
  ];
}

function recursionCode(upDatas: any[], downDatas: any[]) {
  let nextUpDatas: any[] = [];
  for (const upItem of upDatas) {
    let children: any[] = [];
    upItem["children"] = children;
    let length = downDatas.length - 1;
    for (let index = length; index >= 0; index--) {
      const element = downDatas[index];
      if (upItem["typeCode"] === element["superiorCode"]) {
        let treeItem = {
          typeCode: element.typeCode,
          superiorCode: element.superiorCode,
          label: element.typeName
        };
        children.push(treeItem);
        nextUpDatas.push(treeItem);
        downDatas.splice(index, 1);
      }
    }
  }
  if (downDatas.length > 0) {
    recursionCode(nextUpDatas, downDatas);
  }
}

/**
 * 将列表转为树形结构,该方法不会破坏原有数据,但会增加循环次数,数据顺序不会颠倒
 * @param data 需要递归的数据
 * @param rootName 根目录名称
 * @returns 递归后的数据
 */
export function toTreeCodeUnchange(data: any[], rootName: string) {
  let ancestors: any[] = [];
  let nextLoopData: any[] = [];
  data.forEach(element => {
    // 注意,需要指定顶层结构的superiorCode为0
    if (element.superiorCode === '0') {
      ancestors.push({
        typeCode: element.typeCode,
        superiorCode: element.superiorCode,
        label: element.typeName
      });
    } else {
      nextLoopData.push(element);
    }
  });
  recursionCodeUnchange(ancestors, nextLoopData);
  return [
    {
      typeCode: '0',
      superiorCode: '0',
      label: rootName,
      children: ancestors,
    },
  ];
}

function recursionCodeUnchange(upDatas: any[], downDatas: any[]) {
  let nextUpDatas: any[] = [];
  let nextLoopData: any[] = [];
  downDatas.forEach(element => {
    let flag: boolean = false;
    upDatas.forEach(element1 => {
      let children: any[] = [];
      if (!(Object.prototype.hasOwnProperty.call(element1, "children"))) {
        element1["children"] = children;
      } else {
        children = element1["children"];
      }
      if (element1["typeCode"] === element["superiorCode"]) {
        let treeItem = {
          typeCode: element.typeCode,
          superiorCode: element.superiorCode,
          label: element.typeName
        };
        children.push(treeItem);
        nextUpDatas.push(treeItem);
        flag = true;
        return;
      }
    });
    if (!flag) {
      nextLoopData.push(element);
    }
  });
  if (nextLoopData.length > 0) {
    recursionCodeUnchange(nextUpDatas, nextLoopData);
  }
}
