create trigger count_inc_insert
    -> after insert
    -> on campaignvotedetails
    -> for each row
    -> begin
    -> if new.voteType = '1' then
    -> update campaign set upVoteCount = upVoteCount + 1 where cid = new.cid;
    -> end if;
    -> if new.voteType = '2' then
    -> update campaign set downVoteCount = downVoteCount + 1 where cid = new.cid;
    -> end if;
    -> end $$

create trigger count_update
    -> after update
    -> on campaignvotedetails
    -> for each row
    -> begin
    -> if new.voteType = '1' then
    -> update campaign set upVoteCount = upVoteCount + 1, downVoteCount = downVoteCount -1 where cid = new.cid;
    -> end if;
    -> if new.voteType = '2' then
    -> update campaign set upVoteCount = upVoteCount - 1,downVoteCount = downVoteCount +1 where cid = new.cid;
    -> end if;
    -> end $$

create trigger count_delete
    -> after delete
    -> on campaignvotedetails
    -> for each row
    -> begin
    -> if old.voteType = '1' then
    -> update campaign set upVoteCount = upVoteCount -1 where cid = old.cid;
    -> end if;
    -> if old.voteType = '2' then
    -> update campaign set downVoteCount = downVoteCount -1 where cid = old.cid;
    -> end if;
    -> end $$

