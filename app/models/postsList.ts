import { Post } from "./post";
export class PostsList {

    PostsList: Array<Post>;

    constructor() {
        this.PostsList = [];
    }


    ///////////// GETS ///////////////

    IsEmpty() {
        if (this.PostsList.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    // Returns every post in the POSTS array
    GetAll() {
        return this.PostsList;
    }

    // Returns the post of given ID
    GetPostByID(PostID) {
        let result;
        console.log(" posts.ts getpostbyid " + PostID);
        this.PostsList.forEach(post => {
            // console.log(post);
            if (post.id == PostID) {
                result = post;
                console.log("entrou");
            }
        });
        if (!result) {
            result = "Post Not Found";
        }
        return result;
    }

    // Returns every Post of a host by giving the host ID
    GetPostsByHostID(HostID) {
        let result: Array<Post> = [];
        this.PostsList.forEach(post => {
            console.log(post);
            console.log(post.host.GetID());
            if (post.host.GetID() == HostID) {
                result.push(post);
            }
        });
        return result;
    }


    GetPostsByHomeDelivery(state) {
        let result: Array<Post> = [];
        this.PostsList.forEach(post => {
            if (post.homedelivery == state) {
                result.push(post);
            }
        });
        return result;
    }

    GetPostsByStorageType(value) {
        let result: Array<Post> = [];
        this.PostsList.forEach(post => {
            if (post.storagetype == value) {
                result.push(post);
            }
        });
        return result;
    }

    GetPostsByStorageSize(value) {
        let result: Array<Post> = [];
        this.PostsList.forEach(post => {
            if (post.storagesize == value) {
                result.push(post);
            }
        });
        return result;
    }

    Filter(ActiveFilters) {
        let result: Array<Post> = [];
        let hasHomeDeliveryFilter: boolean = false;
        let hasStorageTypeFilter: boolean = false;
        let hasStorageSizeFilter: boolean = false;
        if (ActiveFilters.HomeDelivery !== '-1') {
            hasHomeDeliveryFilter = true;
        }
        if (ActiveFilters.StorageType.Value !== -1) {
            hasStorageTypeFilter = true;
        }
        if (ActiveFilters.StorageSize.Value !== -1) {
            hasStorageSizeFilter = true;
        }

        if (hasHomeDeliveryFilter && hasStorageTypeFilter && hasStorageSizeFilter) {
            this.PostsList.forEach(post => {
                if (post.homedelivery == ActiveFilters.HomeDelivery && post.storagesize == ActiveFilters.StorageSize.Value && post.storagetype == ActiveFilters.StorageType.Value) {
                    result.push(post);
                }
            });
        } else if (hasHomeDeliveryFilter && hasStorageTypeFilter) {
            this.PostsList.forEach(post => {
                if (post.homedelivery == ActiveFilters.HomeDelivery && post.storagetype == ActiveFilters.StorageType.Value) {
                    result.push(post);
                }
            });
        } else if (hasHomeDeliveryFilter && hasStorageSizeFilter) {
            this.PostsList.forEach(post => {
                if (post.homedelivery == ActiveFilters.HomeDelivery && post.storagesize == ActiveFilters.StorageSize.Value) {
                    result.push(post);
                }
            });
        } else if (hasStorageTypeFilter && hasStorageSizeFilter){
            this.PostsList.forEach(post => {
                if (post.storagesize == ActiveFilters.StorageSize.Value && post.storagetype == ActiveFilters.StorageType.Value) {
                    result.push(post);
                }
            });
        } else if (hasStorageTypeFilter){
            this.PostsList.forEach(post => {
                if (post.storagetype == ActiveFilters.StorageType.Value) {
                    result.push(post);
                }
            });
        } else if(hasStorageSizeFilter){
            this.PostsList.forEach(post => {
                if (post.storagesize == ActiveFilters.StorageSize.Value) {
                    result.push(post);
                }
            });
        }else if(hasHomeDeliveryFilter){
            this.PostsList.forEach(post => {
                if (post.homedelivery == ActiveFilters.HomeDelivery) {
                    result.push(post);
                }
            });
        }
        return result;
    }
    ///////////// GETS END ///////////////


    /////////////   SETS   ///////////////

    //Adds a Post Object in the POSTS array
    Add(Post: Post) {
        this.PostsList.push(Post);
    }

    //Deletes every Post Object from POSTS array
    DeleteAll() {
        this.PostsList = [];
    }

    ///////////// END SETS  ///////////////
}   