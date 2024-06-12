import React from "react";
import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
	return (
		<footer>
			<div className="border-t-2 max-w-[1100px] mx-auto pb-20 pt-10 flex justify-between">
				<div className="flex flex-col gap-2">
					<Link
						className="font-black text-xl p-2 pt-0 rounded-lg hover:bg-slate-50 -translate-x-3 w-fit"
						href="/"
					>
						Catch<span className="text-slate-500 font-black">Spot</span>
					</Link>
					<p className=" max-w-48 text-sm">
						A community for anglers to share their catches and learn about
						different species
					</p>
                    <div className="flex gap-4 mt-4">
						<a href="#" className="text-sm font-semibold">
							Facebook
						</a>
						<a href="#" className="text-sm font-semibold">
							Twitter
						</a>
						<a href="#" className="text-sm font-semibold">
							Instagram
						</a>
					</div>
				</div>
                <div className="flex gap-20">
                    <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-lg">Resources</h4>
                        <a href="#" className="text-sm">
                            About
                        </a>
                        <a href="#" className="text-sm">
                            Contact
                        </a>
                        <a href="#" className="text-sm">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm">
                            Terms of Service
                        </a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-lg">Community</h4>
                        <a href="#" className="text-sm">
                            Forum
                        </a>
                        <a href="#" className="text-sm">
                            Blog
                        </a>
                        <a href="#" className="text-sm">
                            Events
                        </a>
                    </div>
                </div>
			</div>
		</footer>
	);
}
