module.exports = dictionary;

function dictionary(parent) {
  var dict = Object.create(parent);
  dict['_dict'] = null;
  delete dict['_dict'];
  return dict;
}
