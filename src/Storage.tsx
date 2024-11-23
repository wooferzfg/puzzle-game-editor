import _ from 'lodash';

export async function loadFile(): Promise<string> {
  const file = await _loadFileFromDialog();
  const fileData = await _readFile(file);
  return fileData;
}

export async function exportFile(jsonData: string, fileName: string): Promise<void> {
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = await URL.createObjectURL(blob);

  try {
    const element = document.createElement('a');

    element.setAttribute('href', url);
    element.setAttribute('download', fileName);
    element.style.display = 'none';

    document.body.appendChild(element);

    try {
      element.click();
    } finally {
      document.body.removeChild(element);
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function _loadFileFromDialog(): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');

    input.onchange = () => {
      const file = _.first(input.files);

      if (_.isNil(file)) {
        reject();
        return;
      }

      resolve(file);
    };

    input.click();
  });
}

async function _readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const contents = reader.result;

      if (_.isNil(contents)) {
        reject();
        return;
      }

      resolve(contents as string);
    };

    reader.readAsText(file);
  });
}