import { use } from "passport";
import type{IUser} from "../models/user.model.ts";

export const formatProfile = (user:IUser,viewerId?:string)=>{
    const isOwner = viewerId && viewerId.toString() === user._id.toString();
    const isFriend = viewerId && user.friends.includes(viewerId as any)

    if(user.privacy.profileVisibility === "private" && !isOwner){
        return {
            _id:user._id,
            username:user.username,
            name:user.name
        }
    }

    if(user.privacy.profileVisibility === "friends" && !isOwner && !isFriend){
        return {
            _id:user._id,
            username:user.username,
            name:user.name,
            avatar:user.avatar
        }
    }
    const profile: any = {
        _id:user._id,
        name:user.name,
        username:user.username,
        bio:user.bio,
        avatar:user.avatar,
        coverPhoto:user.coverPhoto,
        gender:user.gender,
        friendsCount:user.counts.friends,
        followersCount:user.counts.followers,
        followingCount:user.counts.following
    };
    if (user.privacy.showEmail || isOwner) profile.email = user.email;
    if (user.privacy.showPhone || isOwner) profile.phone = user.phone;
    return profile;
}