# Selected Asset Type

Selected Asset Type is an array of objects that contains the asset information when using the `handleSelection`, `handleAssetSelection`, and `onDrop` functions. The following table describes some of the important properties of the Selected Asset object.

> You can find an example of the complete list of properties in [Selected Asset Type data file][asset-type-data-example].

| Property                                                            | Type                  | Explanation                                                                                                                   |
|---------------------------------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `repo:repositoryId`                                                 | string                | Unique identifier for the repository where the asset is stored.                                                               |
| `repo:id`                                                           | string                | Unique identifier for the asset.                                                                                              |
| `repo:assetClass`                                                   | string                | The classification of the asset (e.g., image, video, document).                                                               |
| `repo:name`                                                         | string                | The name of the asset, including the file extension.                                                                          |
| `repo:size`                                                         | number                | The size of the asset in bytes.                                                                                               |
| `repo:path`                                                         | string                | The location of the asset within the repository.                                                                              |
| `repo:ancestors`                                                    | `Array<string>`       | An array of ancestor items for the asset in the repository.                                                                   |
| `repo:state`                                                        | string                | Current state of the asset in the repository (e.g., active, deleted).                                                         |
| `repo:createdBy`                                                    | string                | The user or system that created the asset.                                                                                    |
| `repo:createDate`                                                   | string                | The date and time when the asset was created.                                                                                 |
| `repo:modifiedBy`                                                   | string                | The user or system that last modified the asset.                                                                              |
| `repo:modifyDate`                                                   | string                | The date and time when the asset was last modified.                                                                           |
| `dc:format`                                                         | string                | The format of the asset, such as the file type (e.g., JPEG, PNG, etc.).                                                       |
| `tiff:imageWidth`                                                   | number                | The asset's width.                                                                                                            |
| `tiff:imageLength`                                                  | number                | The asset's height.                                                                                                           |
| `computedMetadata`                                                  | `Record<string, any>` | An object which represents a bucket for all the asset's metadata of all kinds (repository, application or embedded metadata). |
| `_links`                                                            | `Record<string, any>` | Represents hypermedia links for the associated asset. Includes links for resources such as metadata and renditions.           |
| `_links.http://ns.adobe.com/adobecloud/rel/rendition`               | `Array<Object>`       | Array of objects containing information about renditions of the asset.                                                        |
| `_links.http://ns.adobe.com/adobecloud/rel/rendition[].href`        | string                | The URI to the rendition.                                                                                                     |
| `_links.http://ns.adobe.com/adobecloud/rel/rendition[].type`        | string                | The MIME type of the rendition.                                                                                               |
| `_links.http://ns.adobe.com/adobecloud/rel/rendition[].'repo:size'` | number                | The size of the rendition in bytes.                                                                                           |
| `_links.http://ns.adobe.com/adobecloud/rel/rendition[].width`       | number                | The rendition's width.                                                                                                        |
| `_links.http://ns.adobe.com/adobecloud/rel/rendition[].height`      | number                | The rendition's height.                                                                                                       |
