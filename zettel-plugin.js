module.exports = {
    // This function will be called when the plugin is activated
    onload: function () {
      // Register a command to retrieve the current file name
      this.app.commands.addCommand({
        id: 'print-current-file-name',
        name: 'Print Current File Name',
        callback: () => {
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile) {
            const fileName = activeFile.basename;
            console.log(`Current file name: ${fileName}`);
          } else {
            console.log('No active file.');
          }
        },
      });
    },
  };
  