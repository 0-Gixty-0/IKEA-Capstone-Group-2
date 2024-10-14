'use client'

import {useSession} from "next-auth/react";
import React from "react";
import AccessError from "@/app/components/AccessError/AccessError";
import {UserRole} from "@/types";

interface RoleGateProps {
    children: React.ReactNode,
    allowedRoles: UserRole[]
}

function containsAny(arr1: UserRole[], arr2: UserRole[]) {
    return arr1.some(item => arr2.includes(item));
}

/**
 * Rolegate administrates access to content within a page.
 * The RoleGate is meant to be used as a wrapper for the component with access restrictions.
 * If the user has an allowed role then the wrapped content is displayed.
 * Otherwise AccessError component is rendered with error message
 * @param param0 Object containing
 * children: Wrapped components to administrate access for, allowedRoles: list of roles allowed access to wrapped content
 * @returns Content administration component
 */
export default function RoleGate({ children , allowedRoles } : RoleGateProps) {
    const session = useSession()
    const userRoles = session.data?.user?.roles

    if(userRoles && containsAny(allowedRoles, userRoles)) {
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <AccessError message={"You do not have access to this content"}></AccessError>
    )
}