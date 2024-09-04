const GoogleDriveService = {
  async uploadFolder(
    accesstoken: string,
    folderName: string
  ): Promise<string | null> {
    let createFolderOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mimeType: "application/vnd.google-apps.folder",
        name: folderName,
        parents: ["1-4H1RA8oTDujl4ayADx9ab6eNrEzxfgy"],
      }),
    };
    try {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        createFolderOptions
      );
      if (response.status !== 200) {
        return null;
      }
      const json = await response.json();
      return json.id;
    } catch (err) {
      return null;
    }
  },
  async uploadFile(accesstoken: string, body: any): Promise<any | null> {
    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        }
      );
      if (response.status !== 200) {
        return null;
      }
      const json = await response.json();
      return json.id;
    } catch (error) {
      return null;
    }
  },
  async deleteFileOrFolder(id: string, accessToken: string): Promise<boolean> {
    try {
      const url = `https://www.googleapis.com/drive/v3/files/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 204 && response.status !== 200) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  },
};

export default GoogleDriveService;
