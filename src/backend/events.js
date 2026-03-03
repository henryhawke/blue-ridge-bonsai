import wixData from 'wix-data';

/**
 * Event handler triggered when a member is updated.
 * Automatically syncs member data to the MemberDirectoryPrefs CMS collection.
 */
export async function wixMembers_onMemberUpdated(event) {
  const member = event.entity;
  const memberId = member._id;

  try {
    const { items } = await wixData.query("MemberDirectoryPrefs")
      .eq("_id", memberId)
      .limit(1)
      .find({ suppressAuth: true });

    let existingRecord = items.length > 0 ? items[0] : { _id: memberId };

    // Extract optInToDirectory from custom fields if present
    let optIn = existingRecord.optInToDirectory || false;
    const customFields = member.contactDetails?.customFields;
    
    if (customFields) {
      const optInKey = Object.keys(customFields).find(k => 
        k.toLowerCase() === 'optintodirectory' || k.includes('optIn')
      );
      if (optInKey) {
        const cfVal = customFields[optInKey];
        optIn = (typeof cfVal === 'object' && cfVal !== null && 'value' in cfVal) 
          ? cfVal.value 
          : cfVal;
      }
    }

    const updatedRecord = {
      ...existingRecord,
      firstName: member.contactDetails?.firstName || "",
      lastName: member.contactDetails?.lastName || "",
      loginEmail: member.loginEmail || "",
      membershipStatus: member.status || "",
      nickname: member.profile?.nickname || "",
      slug: member.profile?.slug || "",
      profilePhotoUrl: member.profile?.profilePhoto?.url || "",
      phones: member.contactDetails?.phones || [],
      emails: member.contactDetails?.emails || [],
      addresses: member.contactDetails?.addresses || [],
      privacyStatus: member.privacyStatus || "",
      activityStatus: member.activityStatus || "",
      optInToDirectory: optIn,
    };

    await wixData.save("MemberDirectoryPrefs", updatedRecord, { suppressAuth: true });
    console.log(`MemberDirectoryPrefs updated for member ${memberId}`);
  } catch (error) {
    console.error("Error updating MemberDirectoryPrefs on member update:", error);
  }
}

/**
 * Event handler triggered when a new member is created.
 * Automatically adds the member to the MemberDirectoryPrefs CMS collection.
 */
export async function wixMembers_onMemberCreated(event) {
  const member = event.entity;
  const memberId = member._id;

  try {
    let optIn = false;
    const customFields = member.contactDetails?.customFields;
    
    if (customFields) {
      const optInKey = Object.keys(customFields).find(k => 
        k.toLowerCase() === 'optintodirectory' || k.includes('optIn')
      );
      if (optInKey) {
        const cfVal = customFields[optInKey];
        optIn = (typeof cfVal === 'object' && cfVal !== null && 'value' in cfVal) 
          ? cfVal.value 
          : cfVal;
      }
    }

    const newRecord = {
      _id: memberId,
      firstName: member.contactDetails?.firstName || "",
      lastName: member.contactDetails?.lastName || "",
      loginEmail: member.loginEmail || "",
      membershipStatus: member.status || "",
      nickname: member.profile?.nickname || "",
      slug: member.profile?.slug || "",
      profilePhotoUrl: member.profile?.profilePhoto?.url || "",
      phones: member.contactDetails?.phones || [],
      emails: member.contactDetails?.emails || [],
      addresses: member.contactDetails?.addresses || [],
      privacyStatus: member.privacyStatus || "",
      activityStatus: member.activityStatus || "",
      optInToDirectory: optIn,
    };

    await wixData.insert("MemberDirectoryPrefs", newRecord, { suppressAuth: true });
    console.log(`MemberDirectoryPrefs created for member ${memberId}`);
  } catch (error) {
    console.error("Error inserting into MemberDirectoryPrefs on member create:", error);
  }
}
