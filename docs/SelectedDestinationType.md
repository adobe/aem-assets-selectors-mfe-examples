# Selected Destination Type

Selected Destination Type is an object that contains the details of the destination asset when using `onConfirm` `onItemSelect`, `onTreeToggleItem`, or `onTreeSelectionChange` functions. The following table describes some of the important properties of the Selected Destination object.

| Property            | Type                             | Explanation                                                           |
|---------------------|----------------------------------|-----------------------------------------------------------------------|
| *repo:repositoryId* | string                           | Unique identifier for the repository where the asset is stored.       |
| *repo:id*           | string                           | Unique identifier for the asset.                                      |
| *repo:assetClass*   | string                           | The classification of the asset (e.g., image, video, document).       |
| *repo:name*         | string                           | The name of the asset, including the file extension.                  |
| *repo:size*         | number                           | The size of the asset in bytes.                                       |
| *repo:path*         | string                           | The location of the asset within the repository.                      |
| *repo:ancestors*    | `Array<string>`                  | An array of ancestor items for the asset in the repository.           |
| *repo:state*        | string                           | Current state of the asset in the repository (e.g., active, deleted). |
| *repo:createdBy*    | string                           | The user or system that created the asset.                            |
| *repo:createDate*   | string                           | The date and time when the asset was created.                         |
| *repo:modifiedBy*   | string                           | The user or system that last modified the asset.                      |
| *repo:modifyDate*   | string                           | The date and time when the asset was last modified.                   |
| *dc:format*         | string                           | The format of the asset.                                              |
| *children*          | `Array<SelectedDestinationType>` | Assets that are available under the selected destination.             |
